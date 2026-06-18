import styles from "./Table.module.css";

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  caption?: string;
}

export function Table<T extends Record<string, unknown>>({
  columns,
  data,
  caption,
}: TableProps<T>) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        {caption ? <caption className={styles.caption}>{caption}</caption> : null}
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={styles.th} scope="col">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className={styles.empty}>
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={(row.id as string) || i} className={styles.tr}>
                {columns.map((col) => (
                  <td key={col.key} className={styles.td}>
                    {col.render ? col.render(row) : (row[col.key] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
