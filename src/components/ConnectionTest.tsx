import { useState } from 'react';

export function ConnectionTest() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setResult('Testing connection...');

    try {
      // Test 1: Basic fetch
      const response = await fetch('http://localhost:8000/api/auth/professor/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'prof_test',
          password: 'prof123',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(`✅ SUCCESS!\n\nBackend is connected!\n\nResponse:\n${JSON.stringify(data, null, 2)}`);
      } else {
        setResult(`❌ FAILED!\n\nStatus: ${response.status}\n\nResponse:\n${JSON.stringify(data, null, 2)}`);
      }
    } catch (error: any) {
      setResult(`❌ ERROR!\n\n${error.message}\n\nMake sure:\n1. Backend is running: python manage.py runserver\n2. Backend is on http://localhost:8000\n3. CORS is configured correctly`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 shadow-xl max-w-md">
        <h3 className="text-white font-semibold mb-2">🔌 Connection Test</h3>
        <button
          onClick={testConnection}
          disabled={loading}
          className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 mb-2"
        >
          {loading ? 'Testing...' : 'Test Backend Connection'}
        </button>
        {result && (
          <pre className="text-xs text-gray-300 bg-slate-900 p-3 rounded overflow-auto max-h-60">
            {result}
          </pre>
        )}
      </div>
    </div>
  );
}
