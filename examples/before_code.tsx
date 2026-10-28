import React, { useState } from 'react';

/**
 * Example component demonstrating the just-code-claude workflow.
 * Notice how Claude writes all React state, TypeScript logic, and Tailwind classes,
 * while leaving rich, detailed Context Directives inside __AGY__ placeholders
 * for Gemini (3.8 flash) to generate polished, human copy.
 */
export function UserSettingsCard() {
  const [saved, setSaved] = useState(false);

  return (
    <form className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-bold text-gray-900">
        __AGY__("Context: Account settings header | Intent: Welcome user to their personal preferences page | Tone: Warm, professional | Constraints: 3-5 words, Title Case | Model: 3.8 flash", "English")__
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          __AGY__("Context: Profile name input field label | Intent: Instruct user to enter legal full name for invoices | Tone: Clear, formal | Constraints: 2 words, Title Case", "English")__
        </label>
        <input
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          placeholder=__AGY__("Context: Full name input placeholder | Intent: Provide friendly, realistic sample name | Tone: Relatable | Constraints: Example full name like 'Jane Doe'", "English")__
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          __AGY__("Context: User biography field label | Intent: Label textarea for public profile description | Tone: Concise | Constraints: 1-2 words", "English")__
        </label>
        <textarea
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          placeholder=__AGY__("Context: Bio textarea placeholder | Intent: Guide user on writing a brief summary within 150 characters | Tone: Helpful, encouraging | Constraints: Single sentence under 70 chars", "English")__
        />
      </div>

      <div className="flex space-x-3">
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          __AGY__("Context: Primary form submission action | Intent: Commit changes to database | Tone: Confident, decisive | Constraints: 2 words, Title Case", "English")__
        </button>
        <button
          type="button"
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
        >
          __AGY__("Context: Secondary dismiss action | Intent: Discard unsaved changes and return to dashboard | Tone: Neutral | Constraints: 1 word, Title Case", "English")__
        </button>
      </div>

      {saved && (
        <div className="p-3 bg-green-50 text-green-700 rounded-md text-sm">
          __AGY__("Context: Post-submit success toast banner | Intent: Confirm profile changes have been securely saved | Tone: Reassuring, polite | Constraints: Single sentence under 50 chars", "English")__
        </div>
      )}
    </form>
  );
}
