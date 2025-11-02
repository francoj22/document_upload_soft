function App() {
  console.log('Simple App component rendering...');
  
  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h1 style={{ color: 'black', fontSize: '24px' }}>PDF Document Signer - TEST</h1>
      <p style={{ color: 'black' }}>This is a test to see if the app renders</p>
      <div style={{ backgroundColor: 'white', padding: '20px', marginTop: '20px' }}>
        <p>If you can see this, the React app is working!</p>
      </div>
    </div>
  );
}

export default App;