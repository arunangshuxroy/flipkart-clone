"use client";

import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function ImageUploader({ onUploadSuccess }: { onUploadSuccess: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [errorMSG, setErrorMSG] = useState<string | null>(null);

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      setErrorMSG(null);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
      
      onUploadSuccess(data.publicUrl);
    } catch (error: any) {
      setErrorMSG(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <label className="bg-[#2874f0] text-white px-4 py-2 font-medium rounded-sm shadow-sm cursor-pointer hover:bg-blue-700 transition">
        {uploading ? 'Uploading...' : 'Upload Image'}
        <input 
          type="file" 
          accept="image/*" 
          onChange={uploadImage} 
          disabled={uploading}
          className="hidden"
        />
      </label>
      {errorMSG && <p className="text-red-500 text-sm">{errorMSG}</p>}
      <p className="text-gray-500 text-xs">Require 'product-images' bucket in Supabase.</p>
    </div>
  );
}
