
const Navbar = () => {
  return (<div className="navbar py-7 flex itemes-center justify-between">
  <div className="logo">
    <h1 className="text-3xl font-bold bg-white text-black p-1 md:bg-transparent md:text-white">My Portfolio</h1>
  </div>
  <ul className="menu flex items-center gap-10 md:static fixed left-1/2 -translate-x-1/2 md:-translate-x-0 -top-10 opacity-0 md:opacity-100">
    <li>
        <a href="#" className="text-lg font-medium">Home</a>
    </li>
    <li>
        <a href="#" className="text-lg font-medium">About</a>
    </li>
    <li>
        <a href="#" className="text-lg font-medium">project</a>
    </li>
    <li>
        <a href="#" className="text-lg font-medium">contact</a>
    </li>
</ul>
  </div>
  )
}

export default Navbar