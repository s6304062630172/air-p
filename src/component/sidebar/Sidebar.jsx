import "./sidebar.css";
import {Dashboard, Inventory,Groups,EventNote} from "@mui/icons-material"
import { Link } from 'react-router-dom'


export default function Sidebar() {
  return ( 
    <div className='sidebar'>
      <div className='sidebarWrapper'>
        <div className='sidebarMenu'>
          <div className='topLeft'>
                <span className='logo'>แสงทอง Air service</span>
    </div>
          <h3 className='title'><Dashboard /><a className="a">Dashborad</a></h3>
          <h3 className='title'><Inventory /><Link to = "/Product" className="a"  >Manage Product</Link></h3>
          <h3 className='title'><Groups /><Link to = "/Employee" className="a">Manage Employee</Link></h3>
          <h3 className='title'><EventNote /><Link to ="/Calendar" className="a">schedule</Link></h3>
          <h3 className='title'><EventNote /><Link to ="/Quotation" className="a">Quatation</Link></h3>
        </div>
      </div>
      
    </div>
    
  )
}



