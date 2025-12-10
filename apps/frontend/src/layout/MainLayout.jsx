export default function MainLayout({ children }) {
  return (
    <div>
      <header
        style={{
          padding: '12px 24px',
          borderBottom: '1px solid #ddd',
          marginBottom: '24px',
        }}
      >
        <h1 style={{ margin: 0 }}>Gakuwa</h1>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
          チーム開発用 Qiita クローン
        </p>
      </header>

      <main>{children}</main>

      <footer
        style={{
          marginTop: '40px',
          padding: '12px 24px',
          borderTop: '1px solid #ddd',
          fontSize: '0.8rem',
          color: '#888',
        }}
      >
        © {new Date().getFullYear()} Gakuwa
      </footer>
    </div>
  )
}
