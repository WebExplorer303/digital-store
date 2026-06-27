import React, { useState } from 'react';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface DeleteProductProps {
  productId: string;
  onDelete: (id: string) => void;
}

export default function DeleteProduct({ productId, onDelete }: DeleteProductProps) {
  const [isDeleting, setIsDeleting] = useState(false);
const [error, setError] = useState<string | null>(null);

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsDeleting(true);
    setError(null);
    try{
        await deleteDoc(doc(db,"products", productId));
            onDelete(productId);
    } catch (err) {
        setError('Failed to delete product.');
    } finally {
        setIsDeleting(false);
    }
}

return  <div>
    <button onClick={handleDelete} disabled={isDeleting} 
      style={{
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.95rem',
              fontWeight: 'bold',
              color: '#ffffff',
              background: '#e53e3e',
              padding: '8px 16px',
              borderRadius: '6px',
              boxShadow: '0 2px 4px rgba(229, 62, 62, 0.2)',
              transition: 'background 0.2s',
              fontFamily: 'inherit'
            }}
    >
        {isDeleting ? 'Deleting...' : 'Delete Product'}
    </button>
    {error && <p style={{ color: 'red' }}>{error}</p>}
</div>
}
