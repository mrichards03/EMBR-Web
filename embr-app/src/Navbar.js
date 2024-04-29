import logo from "./res/Logo-01.png"
function Navbar() {
    return (
        <div className="row bg-dark">
      <div className="col-lg-3 justify-content-end logo-container">
        <img src={logo} alt="Logo" className="logo float-right"/>
      </div>
      <div className="col-lg-6 title-container">
        <h1 className="title text-white">EMBR Dashboard</h1>
      </div>
      </div>
    )

}
export default Navbar;