import React, { useState } from 'react';

export function UserSettingsCard() {
  const [saved, setSaved] = useState(false);

  return (
    <form className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-bold text-gray-900">
        __AGY__("Friendly settings page title welcoming the user", "English")__
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          __AGY__("Full Name input label", "English")__
        </label>
        <input
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          placeholder=__AGY__("Placeholder example like 'Jane Doe'", "English")__
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          __AGY__("Bio input label", "English")__
        </label>
        <textarea
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          placeholder=__AGY__("Short guidance placeholder explaining 150 char limit", "English")__
        />
      </div>

      <div className="flex space-x-3">
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          __AGY__("Save changes primary button CTA", "English")__
        </button>
        <button
          type="button"
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
        >
          __AGY__("Cancel button text", "English")__
        </button>
      </div>

      {saved && (
        <div className="p-3 bg-green-50 text-green-700 rounded-md text-sm">
          __AGY__("Success notification indicating profile was updated safely", "English")__
        </div>
      )}
    </form>
  );
}
