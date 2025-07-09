import React from 'react';

export const Textarea = ({ value, onChange }: any) => (
  <textarea
    className="w-full p-2 border rounded mb-4"
    rows={4}
    value={value}
    onChange={onChange}
    placeholder="ここに回答を入力してください"
  />
);
