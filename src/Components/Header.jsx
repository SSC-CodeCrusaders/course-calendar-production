import { Link } from "react-router-dom";

const Header = () => {
  return (
    <nav className="bg-primary text-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">LewisCal</h1>
        <div className="space-x-6">
        <Link className="hover:text-gray" to="/">
            Home
          </Link>
          <Link className="hover:text-gray" to="/download">
            Download
          </Link>
          <a
            className="hover:text-gray"
            href="https://salmon-island-04e296f10.5.azurestaticapps.net"
            target="_blank"
            rel="noopener noreferrer"
          >
            Info
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Header;
