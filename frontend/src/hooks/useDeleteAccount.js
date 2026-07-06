import { useState } from 'react';

export default function useDeleteAccount() {
  const [loading, setLoading] = useState(false);

  const performDelete = async () => {
    setLoading(true);
    const res = await fetch('/api/auth/delete-account', { method: 'DELETE' });
    setLoading(false);
    return res.ok;
  };

  return { loading, performDelete };
}
