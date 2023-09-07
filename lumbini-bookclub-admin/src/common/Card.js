function Header({ className, children, withTab = false }) {
  if (withTab) {
    return (
      <div
        className={`px-5 pt-4 items-center bg-gray-50 border-b rounded-t-md ${className}`}
      >
        {children}
      </div>
    );
  }
  return (
    <div
      className={`px-5 py-3 items-center bg-gray-50 border-b rounded-t-md ${className}`}
    >
      {children}
    </div>
  );
}

function Body({ className, children }) {
  return <div className={`p-5 ${className}`}>{children}</div>;
}

function Footer({ className, children }) {
  return (
    <div className={`bg-gray-50 rounded-b-md px-5 py-4 ${className}`}>
      {children}
    </div>
  );
}

function Card({ className, children }) {
  return (
    <div className={`shadow bg-white rounded-md ${className}`}>{children}</div>
  );
}

Card.Header = Header;
Card.Body = Body;
Card.Footer = Footer;

export default Card;
