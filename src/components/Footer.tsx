export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-4">
      <div className="container mx-auto px-4 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} AutoGestión. Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}
