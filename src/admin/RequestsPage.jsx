import React from "react";
import { useNavigate } from "react-router-dom";
import Btn from "@/components/site/Btn";
import { alertClass, fieldClass } from "@/components/site/formStyles";
import { cn } from "@/lib/utils";
import { AdminMessage } from "./AdminShell";
import { SignOutContext } from "./RequireAdmin";

const STATUSES = ["New", "Called", "Matched", "Not proceeding"];

const receivedFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/London",
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});
const formatReceived = (iso) => receivedFormat.format(new Date(iso));

function queryString(params) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) if (value) search.set(key, value);
  const text = search.toString();
  return text ? `?${text}` : "";
}

// Calls an /api/admin endpoint with the session cookie. Returns { status, data }.
async function adminFetch(path, options = {}) {
  try {
    const response = await fetch(path, {
      ...options,
      credentials: "same-origin",
      headers: { Accept: "application/json", ...(options.body ? { "Content-Type": "application/json" } : {}) },
    });
    const data = await response.json().catch(() => ({}));
    return { status: response.status, data };
  } catch {
    return { status: 0, data: {} };
  }
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
  const navigate = useNavigate();
  const signOut = React.useContext(SignOutContext);
  const [status, setStatus] = React.useState("All");
  const [searchInput, setSearchInput] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [rows, setRows] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [counts, setCounts] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [exporting, setExporting] = React.useState(false);
  const [forbidden, setForbidden] = React.useState(false);
  const [error, setError] = React.useState("");
  const [rowErrors, setRowErrors] = React.useState({});
  const requestId = React.useRef(0);
  const wide = useMediaQuery("(min-width: 1024px)");

  const filterParams = React.useMemo(
    () => ({ status: status === "All" ? "" : status, q: search.trim() }),
    [status, search]
  );

  // Shared handling for 401 (signed out) and 403 (not an admin). Returns true if handled.
  const handleAuthStatus = React.useCallback(
    (code) => {
      if (code === 401) {
        navigate("/admin/login", { replace: true });
        return true;
      }
      if (code === 403) {
        setForbidden(true);
        return true;
      }
      return false;
    },
    [navigate]
  );

  // Debounce the search box.
  React.useEffect(() => {
    const timer = window.setTimeout(() => setSearch(searchInput), 300);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  // First page whenever the filter or search changes.
  React.useEffect(() => {
    const id = ++requestId.current;
    setLoading(true);
    setError("");
    adminFetch(`/api/admin/requests${queryString({ ...filterParams, page: "1" })}`).then(({ status: code, data }) => {
      if (id !== requestId.current) return;
      setLoading(false);
      if (handleAuthStatus(code)) return;
      if (code !== 200) {
        setError(data.error || "We couldn't load the requests. Please refresh the page.");
        return;
      }
      setRows(data.items);
      setTotal(data.total);
      setCounts(data.counts);
      setPage(1);
    });
  }, [filterParams, handleAuthStatus]);

  const loadMore = async () => {
    const id = requestId.current;
    setLoadingMore(true);
    const { status: code, data } = await adminFetch(
      `/api/admin/requests${queryString({ ...filterParams, page: String(page + 1) })}`
    );
    setLoadingMore(false);
    if (id !== requestId.current || handleAuthStatus(code)) return;
    if (code !== 200) {
      setError(data.error || "We couldn't load more requests. Please try again.");
      return;
    }
    setRows((current) => [...current, ...data.items.filter((item) => !current.some((row) => row.id === item.id))]);
    setTotal(data.total);
    setCounts(data.counts);
    setPage(page + 1);
  };

  const patchRow = (id, changes) =>
    setRows((current) => current.map((row) => (row.id === id ? { ...row, ...changes } : row)));

  const patchRequest = (id, body) =>
    adminFetch(`/api/admin/requests/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify(body) });

  const changeStatus = async (row, next) => {
    const previous = row.status;
    if (next === previous) return;
    patchRow(row.id, { status: next });
    setRowErrors((current) => ({ ...current, [row.id]: undefined }));
    const { status: code, data } = await patchRequest(row.id, { status: next });
    if (handleAuthStatus(code)) return;
    if (code !== 200) {
      patchRow(row.id, { status: previous });
      setRowErrors((current) => ({
        ...current,
        [row.id]: `Couldn't change the status to "${next}". It's back to "${previous}". ${data.error || "Please try again."}`,
      }));
      return;
    }
    setCounts((current) =>
      current ? { ...current, [previous]: current[previous] - 1, [next]: current[next] + 1 } : current
    );
  };

  const saveNotes = async (row, notes) => {
    const { status: code, data } = await patchRequest(row.id, { notes });
    if (handleAuthStatus(code) || code !== 200) return false;
    patchRow(row.id, { notes: data.notes });
    return true;
  };

  const exportCsv = async () => {
    setExporting(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/export${queryString(filterParams)}`, { credentials: "same-origin" });
      if (handleAuthStatus(response.status)) return;
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const match = /filename="([^"]+)"/.exec(response.headers.get("Content-Disposition") || "");
      const url = URL.createObjectURL(await response.blob());
      const link = document.createElement("a");
      link.href = url;
      link.download = match ? match[1] : "wordcompass-requests.csv";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch {
      setError("We couldn't export the list. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  if (forbidden) {
    return (
      <AdminMessage eyebrow="Admin" title="This account doesn't have admin access">
        <p>If you think it should, ask the site owner to make your account an admin.</p>
        <div className="mt-6">
          <Btn onClick={signOut}>Sign out</Btn>
        </div>
      </AdminMessage>
    );
  }

  const tabCount = (name) =>
    counts ? (name === "All" ? STATUSES.reduce((sum, key) => sum + (counts[key] || 0), 0) : counts[name] ?? 0) : "–";

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
              {tabCount(name)}
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
          maxLength={100}
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
      <a href={`mailto:${row.email}`} className="font-semibold text-teal [overflow-wrap:anywhere] underline-offset-4 hover:underline">
        {row.email}
      </a>
      <br />
      <a href={`tel:${row.phone.replace(/[^\d+]/g, "")}`} className="whitespace-nowrap font-semibold text-teal underline-offset-4 hover:underline">
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
        maxLength={5000}
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
                <td className="min-w-[16rem] px-4 py-4">
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
