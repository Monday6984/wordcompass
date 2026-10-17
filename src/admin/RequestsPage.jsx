import React from "react";
import Btn from "@/components/site/Btn";
import { alertClass, fieldClass } from "@/components/site/formStyles";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { downloadCsv } from "./csv";

const TABLE = "parent_call_requests";
const STATUSES = ["New", "Called", "Matched", "Not proceeding"];
const PAGE_SIZE = 50;
const COLUMNS =
  "id,created_at,parent_name,email,phone,child_age,main_challenge,preferred_call_time,preferred_coach,status,notes";

const receivedFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/London",
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});
const formatReceived = (iso) => receivedFormat.format(new Date(iso));

// PostgREST's or() filter uses commas and brackets as syntax, so drop those from the search.
function applyFilters(query, status, search) {
  let next = status === "All" ? query : query.eq("status", status);
  const term = search.replace(/[,()"'\\%*]/g, " ").trim();
  if (term) next = next.or(`parent_name.ilike.%${term}%,email.ilike.%${term}%,phone.ilike.%${term}%`);
  return next;
}

function useMediaQuery(query) {
  const [matches, setMatches] = React.useState(() => window.matchMedia(query).matches);
  React.useEffect(() => {
    const list = window.matchMedia(query);
    const onChange = () => setMatches(list.matches);
    list.addEventListener("change", onChange);
    onChange();
    return () => list.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

export default function RequestsPage() {
  const [status, setStatus] = React.useState("All");
  const [searchInput, setSearchInput] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [rows, setRows] = React.useState([]);
  const [total, setTotal] = React.useState(0);
  const [counts, setCounts] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [exporting, setExporting] = React.useState(false);
  const [error, setError] = React.useState("");
  const [rowErrors, setRowErrors] = React.useState({});
  const requestId = React.useRef(0);
  const wide = useMediaQuery("(min-width: 1024px)");

  // Debounce the search box.
  React.useEffect(() => {
    const timer = window.setTimeout(() => setSearch(searchInput), 300);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const loadCounts = React.useCallback(async () => {
    const results = await Promise.all(
      ["All", ...STATUSES].map((name) => {
        const query = supabase.from(TABLE).select("id", { count: "exact", head: true });
        return name === "All" ? query : query.eq("status", name);
      })
    );
    const next = {};
    ["All", ...STATUSES].forEach((name, index) => {
      next[name] = results[index].count ?? 0;
    });
    setCounts(next);
  }, []);

  const fetchPage = React.useCallback(
    (from) =>
      applyFilters(
        supabase
          .from(TABLE)
          .select(COLUMNS, { count: "exact" })
          .order("created_at", { ascending: false })
          .range(from, from + PAGE_SIZE - 1),
        status,
        search
      ),
    [status, search]
  );

  // First page whenever the filter or search changes.
  React.useEffect(() => {
    const id = ++requestId.current;
    setLoading(true);
    setError("");
    fetchPage(0).then(({ data, count, error: loadError }) => {
      if (id !== requestId.current) return;
      setLoading(false);
      if (loadError) {
        setError("We couldn't load the requests. Please refresh the page.");
        return;
      }
      setRows(data);
      setTotal(count ?? data.length);
    });
  }, [fetchPage]);

  React.useEffect(() => {
    loadCounts();
  }, [loadCounts]);

  const loadMore = async () => {
    const id = requestId.current;
    setLoadingMore(true);
    const { data, count, error: loadError } = await fetchPage(rows.length);
    setLoadingMore(false);
    if (id !== requestId.current) return;
    if (loadError) {
      setError("We couldn't load more requests. Please try again.");
      return;
    }
    setRows((current) => [...current, ...data]);
    setTotal(count ?? total);
  };

  const patchRow = (id, changes) =>
    setRows((current) => current.map((row) => (row.id === id ? { ...row, ...changes } : row)));

  const changeStatus = async (row, next) => {
    const previous = row.status;
    patchRow(row.id, { status: next });
    setRowErrors((current) => ({ ...current, [row.id]: undefined }));
    const { data, error: saveError } = await supabase.from(TABLE).update({ status: next }).eq("id", row.id).select("id");
    if (saveError || !data?.length) {
      patchRow(row.id, { status: previous });
      setRowErrors((current) => ({
        ...current,
        [row.id]: `Couldn't change the status to "${next}". It's back to "${previous}". Please try again.`,
      }));
      return;
    }
    loadCounts();
  };

  const saveNotes = async (row, notes) => {
    const value = notes.trim() ? notes : null;
    const { data, error: saveError } = await supabase.from(TABLE).update({ notes: value }).eq("id", row.id).select("id");
    if (saveError || !data?.length) return false;
    patchRow(row.id, { notes: value });
    return true;
  };

  const exportCsv = async () => {
    setExporting(true);
    setError("");
    try {
      const all = [];
      for (let from = 0; ; from += 1000) {
        const { data, error: exportError } = await applyFilters(
          supabase.from(TABLE).select(COLUMNS).order("created_at", { ascending: false }).range(from, from + 999),
          status,
          search
        );
        if (exportError) throw exportError;
        all.push(...data);
        if (data.length < 1000) break;
      }
      downloadCsv(all, formatReceived);
    } catch {
      setError("We couldn't export the list. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  const itemProps = (row) => ({
    row,
    error: rowErrors[row.id],
    onStatusChange: (next) => changeStatus(row, next),
    onSaveNotes: (notes) => saveNotes(row, notes),
  });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Admin</p>
          <h1
            className="mt-3 font-heading font-black text-charcoal"
            style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", lineHeight: 1.15 }}
          >
            Parent call requests
          </h1>
        </div>
        <Btn variant="outline" size="sm" onClick={exportCsv} disabled={exporting || loading || total === 0}>
          {exporting ? "Exporting…" : "Export CSV"}
        </Btn>
      </div>

      <div role="group" aria-label="Filter by status" className="mt-8 flex flex-wrap gap-2">
        {["All", ...STATUSES].map((name) => (
          <button
            key={name}
            type="button"
            aria-pressed={status === name}
            onClick={() => setStatus(name)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-4 py-2 font-body text-sm font-semibold transition-colors duration-200",
              status === name
                ? "border-teal-dark bg-teal-dark text-white"
                : "border-teal-dark/35 bg-transparent text-charcoal hover:border-teal-dark hover:bg-white"
            )}
          >
            {name}
            <span className={cn("font-mono text-xs", status === name ? "text-white/80" : "text-mid")}>
              {counts[name] ?? "–"}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-6 max-w-md">
        <label htmlFor="request-search" className="sr-only">
          Search by parent name, email or phone
        </label>
        <input
          id="request-search"
          type="search"
          placeholder="Search name, email or phone"
          className={cn(fieldClass, "mt-0")}
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
        />
      </div>

      {error && (
        <p role="alert" className={cn(alertClass, "mt-6")}>
          {error}
        </p>
      )}

      <div className="mt-8">
        {loading ? (
          <p role="status" className="font-body text-mid">
            Loading requests…
          </p>
        ) : rows.length === 0 ? (
          <div className="card-warm">
            <p className="text-mid">
              {search || status !== "All" ? "No requests match this filter." : "No call requests yet."}
            </p>
          </div>
        ) : wide ? (
          <RequestTable rows={rows} itemProps={itemProps} />
        ) : (
          <ul className="space-y-5">
            {rows.map((row) => (
              <li key={row.id}>
                <RequestCard {...itemProps(row)} />
              </li>
            ))}
          </ul>
        )}
      </div>

      {!loading && rows.length > 0 && (
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <p className="font-body text-sm text-mid">
            Showing {rows.length} of {total}
          </p>
          {rows.length < total && (
            <Btn variant="outline" size="sm" onClick={loadMore} disabled={loadingMore}>
              {loadingMore ? "Loading…" : "Load more"}
            </Btn>
          )}
        </div>
      )}
    </div>
  );
}

function Contact({ row }) {
  return (
    <>
      <a href={`mailto:${row.email}`} className="break-all font-semibold text-teal underline-offset-4 hover:underline">
        {row.email}
      </a>
      <br />
      <a href={`tel:${row.phone.replace(/[^\d+]/g, "")}`} className="font-semibold text-teal underline-offset-4 hover:underline">
        {row.phone}
      </a>
    </>
  );
}

function StatusSelect({ row, onChange, id }) {
  return (
    <select
      id={id}
      aria-label={`Status for ${row.parent_name}`}
      className={cn(fieldClass, "mt-0 py-2")}
      value={row.status}
      onChange={(event) => onChange(event.target.value)}
    >
      {STATUSES.map((name) => (
        <option key={name} value={name}>
          {name}
        </option>
      ))}
    </select>
  );
}

function NotesEditor({ row, onSave }) {
  const [draft, setDraft] = React.useState(row.notes || "");
  const [state, setState] = React.useState("idle"); // idle | saving | saved | error
  const dirty = draft !== (row.notes || "");
  const fieldId = `notes-${row.id}`;

  React.useEffect(() => {
    if (state !== "saved") return undefined;
    const timer = window.setTimeout(() => setState("idle"), 3000);
    return () => window.clearTimeout(timer);
  }, [state]);

  const save = async () => {
    setState("saving");
    setState((await onSave(draft)) ? "saved" : "error");
  };

  return (
    <div>
      <label htmlFor={fieldId} className="sr-only">
        Notes for {row.parent_name}
      </label>
      <textarea
        id={fieldId}
        rows={3}
        placeholder="Notes"
        className={cn(fieldClass, "mt-0 py-2 text-sm")}
        value={draft}
        onChange={(event) => {
          setDraft(event.target.value);
          if (state !== "saving") setState("idle");
        }}
      />
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <Btn variant="outline" size="sm" onClick={save} disabled={!dirty || state === "saving"}>
          {state === "saving" ? "Saving…" : "Save"}
        </Btn>
        <span role="status" className="font-body text-sm">
          {state === "saved" && <span className="font-semibold text-teal">Saved</span>}
          {state === "error" && <span className="font-semibold text-coral">Couldn't save. Please try again.</span>}
        </span>
      </div>
    </div>
  );
}

function RowError({ message }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-2 font-body text-sm font-semibold text-coral">
      {message}
    </p>
  );
}

function RequestCard({ row, error, onStatusChange, onSaveNotes }) {
  return (
    <article className="card-soft">
      <p className="font-mono text-xs uppercase tracking-[0.14em] text-mid">{formatReceived(row.created_at)}</p>
      <h2 className="mt-2 font-heading text-xl font-bold text-charcoal">{row.parent_name}</h2>
      <p className="mt-2 font-body text-base">
        <Contact row={row} />
      </p>
      <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 font-body text-base">
        <dt className="text-mid">Child's age</dt>
        <dd className="text-charcoal">{row.child_age}</dd>
        <dt className="text-mid">Challenge</dt>
        <dd className="text-charcoal">{row.main_challenge}</dd>
        <dt className="text-mid">Call time</dt>
        <dd className="text-charcoal">{row.preferred_call_time}</dd>
        {row.preferred_coach && (
          <>
            <dt className="text-mid">Coach</dt>
            <dd className="text-charcoal">{row.preferred_coach}</dd>
          </>
        )}
      </dl>
      <div className="mt-5">
        <label htmlFor={`status-${row.id}`} className="font-body text-sm font-semibold text-charcoal">
          Status
        </label>
        <div className="mt-1">
          <StatusSelect row={row} onChange={onStatusChange} id={`status-${row.id}`} />
        </div>
        <RowError message={error} />
      </div>
      <div className="mt-5">
        <NotesEditor row={row} onSave={onSaveNotes} />
      </div>
    </article>
  );
}

function RequestTable({ rows, itemProps }) {
  const th = "px-4 py-3 text-left font-mono text-xs font-normal uppercase tracking-[0.14em] text-mid";
  return (
    <div className="overflow-x-auto rounded-2xl border border-black/5 bg-white/84">
      <table className="w-full min-w-[1100px] font-body text-sm">
        <thead className="border-b border-black/5">
          <tr>
            <th scope="col" className={th}>Received</th>
            <th scope="col" className={th}>Parent</th>
            <th scope="col" className={th}>Age</th>
            <th scope="col" className={th}>Challenge</th>
            <th scope="col" className={th}>Call time</th>
            <th scope="col" className={th}>Coach</th>
            <th scope="col" className={cn(th, "w-44")}>Status</th>
            <th scope="col" className={cn(th, "w-72")}>Notes</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const { error, onStatusChange, onSaveNotes } = itemProps(row);
            return (
              <tr key={row.id} className="border-b border-black/5 align-top last:border-0">
                <td className="whitespace-nowrap px-4 py-4 text-mid">{formatReceived(row.created_at)}</td>
                <td className="px-4 py-4">
                  <p className="font-semibold text-charcoal">{row.parent_name}</p>
                  <p className="mt-1">
                    <Contact row={row} />
                  </p>
                </td>
                <td className="px-4 py-4 text-charcoal">{row.child_age}</td>
                <td className="px-4 py-4 text-charcoal">{row.main_challenge}</td>
                <td className="px-4 py-4 text-charcoal">{row.preferred_call_time}</td>
                <td className="px-4 py-4 text-charcoal">{row.preferred_coach || <span className="text-mid">–</span>}</td>
                <td className="px-4 py-4">
                  <StatusSelect row={row} onChange={onStatusChange} />
                  <RowError message={error} />
                </td>
                <td className="px-4 py-4">
                  <NotesEditor row={row} onSave={onSaveNotes} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
