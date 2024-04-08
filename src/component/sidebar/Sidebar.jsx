import "./sidebar.css";
import {Dashboard, Inventory,Groups,EventNote} from "@mui/icons-material"
import { Link } from 'react-router-dom'


export default function Sidebar() {
  return ( 
    // <div className='sidebar'>
    //   <div className='sidebarWrapper'>
    //     <div className='sidebarMenu'>
    //       <div className='topLeft'>
    //             <span className='logo'>แสงทอง Air service</span>
    // </div>
    //       <h3 className='title'><Dashboard /><a className="a">Dashborad</a></h3>
    //       <h3 className='title'><Inventory /><Link to = "/Product" className="a"  >Manage Product</Link></h3>
    //       <h3 className='title'><Groups /><Link to = "/Employee" className="a">Manage Employee</Link></h3>
    //       <h3 className='title'><EventNote /><Link to ="/Calendar" className="a">schedule</Link></h3>
    //       <h3 className='title'><EventNote /><Link to ="/Quotation" className="a">Quatation</Link></h3>
    //     </div>
    //   </div>
      
    // </div>
    <div className="bg-gray-800 text-white w-64 min-h-screen">
      {/* Sidebar content */}
      <div className="p-4">
        <h1 className="text-xl font-bold">Sidebar</h1>
        <ul className="mt-4">
          <li className="py-2 hover:bg-gray-700"><Dashboard />Dashborad</li>
          <li className="py-2 hover:bg-gray-700"><Inventory /><Link to = "/Product" className="a"  >Manage Product</Link></li>
          <li className="py-2 hover:bg-gray-700"><Groups /><Link to = "/Employee" className="a">Manage Employee</Link></li>
          <li className="py-2 hover:bg-gray-700"><EventNote /><Link to ="/Quotation" className="a">Quatation</Link></li>
          <li className="py-2 hover:bg-gray-700"><EventNote /><Link to ="/Calendar" className="a">schedule</Link></li>
          {/* Add more menu items as needed */}
        </ul>
      </div>
    </div>
    
  )
}



