import React from "react";

/**
 * Plain, lazy-loaded image. If a photo file is missing it is hidden rather
 * than showing a broken-image icon.
 */
export const Image = React.forwardRef(function Image({ src, alt = "", loading = "lazy", onError, ...props }, ref) {
  const [failed, setFailed] = React.useState(false);
  React.useEffect(() => setFailed(false), [src]);

  if (!src || failed) {
    return <div ref={ref} role={alt ? "img" : undefined} aria-label={alt || undefined} {...props} style={{ background: "#e8e4de", ...props.style }} />;
  }

  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      loading={loading}
      decoding="async"
      onError={(event) => {
        setFailed(true);
        onError?.(event);
      }}
      {...props}
    />
  );
});
