function THead({ className, children }) {
  return <thead className={`border-b-[3px] ${className}`}>{children}</thead>;
}

function TBody({ className, children }) {
  return (
    <tbody className={`bg-white divide-y divide-gray-200 ${className}`}>
      {children}
    </tbody>
  );
}

function TH({ className, children }) {
  return (
    <th
      scope="col"
      className={`px-4 py-3 border text-left text-sm font-semibold text-gray-600 uppercase whitespace-nowrap overflow-clip ${className}`}
    >
      {children}
    </th>
  );
}

function TD({ className, children }) {
  return <td className={`px-4 py-3 border ${className}`}>{children}</td>;
}

function Table({ className, children }) {
  return (
    <table
      className={`w-full table-fixed border-collapse border rounded ${className}`}
    >
      {children}
    </table>
  );
}

Table.THead = THead;
Table.TBody = TBody;
Table.TH = TH;
Table.TD = TD;

export default Table;
