
import { useMemo, useState } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  X,
} from "lucide-react";

import useDebounce from "./useDebounce";

export default function DataTable({
  title,
  subtitle,
  rows = [],
  columns = [],
  searchPlaceholder = "Search records...",
  searchKeys = [],
  filters = [],
  actions,
  pageSize = 10,
  toolbarExtra,
}) {
  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState({});
  const [sort, setSort] = useState({
    key: columns[0]?.key || "",
    direction: "asc",
  });
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 1000);

  const filtered = useMemo(() => {
    let result = rows.filter((row) => {
      const q = debouncedSearch.trim().toLowerCase();

      const matchesSearch =
        !q ||
        searchKeys.some((key) =>
          String(row[key] ?? "").toLowerCase().includes(q)
        );

      const matchesFilters = filters.every(
        (f) =>
          !filterValues[f.key] ||
          String(row[f.key]) === filterValues[f.key]
      );

      return matchesSearch && matchesFilters;
    });

    if (sort.key) {
      result = [...result].sort((a, b) => {
        const av = a[sort.key] ?? "";
        const bv = b[sort.key] ?? "";

        const cmp =
          typeof av === "number" && typeof bv === "number"
            ? av - bv
            : String(av).localeCompare(String(bv));

        return sort.direction === "asc" ? cmp : -cmp;
      });
    }

    return result;
  }, [
    rows,
    debouncedSearch,
    filterValues,
    filters,
    searchKeys,
    sort,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / pageSize)
  );

  const visible = filtered.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const clear = () => {
    setSearch("");
    setFilterValues({});
    setSort({
      key: columns[0]?.key || "",
      direction: "asc",
    });
    setPage(1);
  };

  const toggleSort = (key) => {
    setSort((old) => ({
      key,
      direction:
        old.key === key && old.direction === "asc"
          ? "desc"
          : "asc",
    }));

    setPage(1);
  };

  return (
    <section className="panel table-panel">
      <div className="section-heading">
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>

        <span className="count-pill">
          {filtered.length} records
        </span>
      </div>

      <div className="table-toolbar">
        <div className="search-box">
          <Search size={17} />

          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder={searchPlaceholder}
          />
        </div>

        {filters.map((f) => (
          <label className="toolbar-filter" key={f.key}>
            {/* <span>{f.label}</span> */}

            <select
              value={filterValues[f.key] || ""}
              onChange={(e) => {
                setFilterValues((v) => ({
                  ...v,
                  [f.key]: e.target.value,
                }));

                setPage(1);
              }}
            >
              <option value="">All {f.label}</option>

              {f.options.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </label>
        ))}

        {toolbarExtra}

        <button
          className="btn btn-outline clear-btn"
          onClick={clear}
        >
          <X size={15} /> Clear Filters
        </button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c.key}>
                  <button
                    className="sort-button"
                    onClick={() => toggleSort(c.key)}
                  >
                    {c.label}
                    <ArrowUpDown size={13} />
                  </button>
                </th>
              ))}

              {actions && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {visible.length ? (
              visible.map((row, i) => (
                <tr key={row.id ?? i}>
                  {columns.map((c) => (
                    <td key={c.key}>
                      {c.render
                        ? c.render(row)
                        : row[c.key]}
                    </td>
                  ))}

                  {actions && (
                    <td>
                      <div className="row-actions">
                        {actions(row)}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="empty-cell"
                >
                  No matching records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="table-bottom">
        <span>
          Showing{" "}
          {filtered.length ? (page - 1) * pageSize + 1 : 0}
          –{Math.min(page * pageSize, filtered.length)} of{" "}
          {filtered.length} records
        </span>

        <div className="pagination">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft size={16} />
          </button>

          <span>
            {page} / {totalPages}
          </span>

          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
