import { Avatar } from "@material-tailwind/react";
import { useState, useEffect } from "react";
import { Outlet, Link, NavLink } from "react-router-dom";

const Navbar = () => {
  const [statusNavbar, setStatusNavbar] = useState(false);
  const [username, setUsername] = useState(localStorage.getItem('username'));
  const toggleNavbar = () => {
    setStatusNavbar(!statusNavbar);
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem("productCart");
    localStorage.setItem('userinfo', "");
    window.location = '/login';
  }
  const onChangePage = (path) => {
    setStatusNavbar(!statusNavbar);
    if (path === "home") {
      document.getElementById("home").click();
    } else if (path === "cart") {
      document.getElementById("cart").click();
    } else if (path === "sucess") {
      document.getElementById("sucess").click();
    } else if (path === "history") {
      document.getElementById("history").click();
    }
  };
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    setUsername(storedUsername);
  }, []); // เรียกใช้ครั้งเดียวหลังจาก Navbar โหลดเสร็จ

  return (
    <>
      <Link to="/" id="home"></Link>
      <Link to="/cart" id="cart"></Link>
      <Link to="/sucess" id="sucess"></Link>
      <Link to="/history" id="history"></Link>
      <nav className="w-full top-0 z-50 bg-gray-800">
        <div className="max-w-12xl mx-auto sm:px-6 lg:px-12">
          <div className="flex items-center h-20 flex justify-between">
            <div className="flex items-center">
              <div className="flex item-center">
                <div className="lg:hidden flex item-center">
                  <button
                    className="inline-flex items-center justify-center p-2 
                                rounded-md   hover:text-black  
                                "
                    onClick={toggleNavbar}
                  >
                    <svg
                      className="text-white h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16m-7 6h7"
                      />
                    </svg>
                  </button>
                </div>
                <div className="flex ">

                  <h2 class="text-3xl text-white">แสงทองแอร์</h2>


                </div>
              </div>
              <div className="hidden lg:block justify-between">
                <div className="ml-4 flex items-center space-x-4">
                  <button
                    className="flex justify-center gap-3 bg-gray-800 rounded text-white text-sm hover:bg-gray-700 px-3 py-1 "
                    onClick={() => onChangePage("home")}
                  >
                    <div className="flex items-center space-x-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-house-fill"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293z" />
                        <path d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293z" />
                      </svg>
                      <span>หน้าหลัก</span>
                    </div>
                  </button>
                  <button
                    className="flex justify-center gap-3 bg-gray-800 rounded text-white text-sm hover:bg-gray-700 px-3 py-1"
                    onClick={() => onChangePage("cart")}
                  >
                    <div className="flex items-center space-x-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-cart-plus"
                        viewBox="0 0 16 16"
                      >
                        <path d="M9 5.5a.5.5 0 0 0-1 0V7H6.5a.5.5 0 0 0 0 1H8v1.5a.5.5 0 0 0 1 0V8h1.5a.5.5 0 0 0 0-1H9z" />
                        <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1zm3.915 10L3.102 4h10.796l-1.313 7zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0m7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                      </svg>
                      <span>ตะกร้า</span>
                    </div>
                  </button>
                  <button
                    className="flex justify-center gap-3 bg-gray-800 rounded text-white text-sm hover:bg-gray-700 px-3 py-1"
                    onClick={() => onChangePage("history")}

                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-hourglass"
                      viewBox="0 0 16 16"
                    >
                      <path d="M2 1.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-1v1a4.5 4.5 0 0 1-2.557 4.06c-.29.139-.443.377-.443.59v.7c0 .213.154.451.443.59A4.5 4.5 0 0 1 12.5 13v1h1a.5.5 0 0 1 0 1h-11a.5.5 0 1 1 0-1h1v-1a4.5 4.5 0 0 1 2.557-4.06c.29-.139.443-.377.443-.59v-.7c0-.213-.154-.451-.443-.59A4.5 4.5 0 0 1 3.5 3V2h-1a.5.5 0 0 1-.5-.5m2.5.5v1a3.5 3.5 0 0 0 1.989 3.158c.533.256 1.011.791 1.011 1.491v.702c0 .7-.478 1.235-1.011 1.491A3.5 3.5 0 0 0 4.5 13v1h7v-1a3.5 3.5 0 0 0-1.989-3.158C8.978 9.586 8.5 9.052 8.5 8.351v-.702c0-.7.478-1.235 1.011-1.491A3.5 3.5 0 0 0 11.5 3V2z" />
                    </svg>
                    ประวัติการใช้บริการ
                  </button>

                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="dropdown dropdown-end flex items-center">
                <div>

                  <div className="flex items-center mr-1">
                    <button onClick={handleLogout} className="flex items-center text-md text-white btn btn hover:text-blue ">
                      logout
                    </button>
                    <span className="flex items-center text-md text-white">
                      {username}
                    </span>
                  </div>
                  <div className="flex items-center mr-1 justify-end">

                  </div>
                </div>
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar ml-2"
                >
                  <Avatar
                    className="border-2 border-white"
                    src="https://docs.material-tailwind.com/img/face-2.jpg"
                  ></Avatar>
                </div>
                {/* <ul
                tabIndex={0}
                className="mt-28 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
              >
                <li>
                    <a onClick={onLogout}>Logout</a>
                  </li>
              </ul> */}
              </div>
            </div>
          </div>
        </div>
        {statusNavbar && (
          <div className="lg:hidden bg-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <div>
                <button
                  className="flex justify-center gap-3 bg-gray-800 w-full rounded text-white text-sm hover:bg-gray-200 px-3 py-1 "
                  onClick={() => onChangePage("home")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-house-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293z" />
                    <path d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293z" />
                  </svg>
                  หน้าหลัก
                </button>
              </div>
              <div>
                <button
                  className="flex justify-center gap-3 bg-gray-800 rounded w-full text-white text-sm hover:bg-gray-200 px-3 py-1 "
                  onClick={() => onChangePage("cart")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-cart-plus"
                    viewBox="0 0 16 16"
                  >
                    <path d="M9 5.5a.5.5 0 0 0-1 0V7H6.5a.5.5 0 0 0 0 1H8v1.5a.5.5 0 0 0 1 0V8h1.5a.5.5 0 0 0 0-1H9z" />
                    <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1zm3.915 10L3.102 4h10.796l-1.313 7zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0m7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                  </svg>
                  ตะกร้า
                </button>
              </div>
              <div>
                <button
                  className="w-full flex justify-center gap-3 bg-gray-800 rounded text-white text-sm hover:bg-gray-700 px-3 py-1 "
                  onClick={() => onChangePage("history")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-hourglass"
                    viewBox="0 0 16 16"
                  >
                    <path d="M2 1.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-1v1a4.5 4.5 0 0 1-2.557 4.06c-.29.139-.443.377-.443.59v.7c0 .213.154.451.443.59A4.5 4.5 0 0 1 12.5 13v1h1a.5.5 0 0 1 0 1h-11a.5.5 0 1 1 0-1h1v-1a4.5 4.5 0 0 1 2.557-4.06c.29-.139.443-.377.443-.59v-.7c0-.213-.154-.451-.443-.59A4.5 4.5 0 0 1 3.5 3V2h-1a.5.5 0 0 1-.5-.5m2.5.5v1a3.5 3.5 0 0 0 1.989 3.158c.533.256 1.011.791 1.011 1.491v.702c0 .7-.478 1.235-1.011 1.491A3.5 3.5 0 0 0 4.5 13v1h7v-1a3.5 3.5 0 0 0-1.989-3.158C8.978 9.586 8.5 9.052 8.5 8.351v-.702c0-.7.478-1.235 1.011-1.491A3.5 3.5 0 0 0 11.5 3V2z" />
                  </svg>
                  ประวัติการใช้บริการ
                </button>
              </div>
              <div>
                <button
                  className="w-full flex justify-center gap-3 bg-gray-800 rounded text-white text-sm hover:bg-gray-700 px-3 py-1 "
                // onClick={() => onChangePage("cart")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-clipboard-check"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0"
                    />
                    <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z" />
                    <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z" />
                  </svg>
                  ตรวจสอบสถานะการติดตั้ง
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
