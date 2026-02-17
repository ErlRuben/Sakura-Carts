function Footer() {
  return (
    <footer className="bg-sakura-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold">Sakura Carts</h3>
            <p className="text-sakura-200 text-sm mt-1">
              Authentic Japanese treasures, delivered to your door.
            </p>
          </div>
          <p className="text-sakura-300 text-sm">
            &copy; {new Date().getFullYear()} Sakura Carts. Made with love in Japan.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
