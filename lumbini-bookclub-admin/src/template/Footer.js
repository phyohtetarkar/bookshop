function Footer() {
  return (
    <footer className="flex items-center justify-center px-5 py-6 bg-white flex-shrink-0">
      <span className="text-gray-500 font-me text-sm text-opacity-75">
        Copyright © {new Date().getFullYear()} {process.env.REACT_APP_APP_NAME}
      </span>
      {/* <span className="text-gray-700 text-opacity-50">Version 1.0.0</span> */}
    </footer>
  );
}

export default Footer;
