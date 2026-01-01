import { forwardRef, type TextareaHTMLAttributes } from 'react';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="mb-4">
        <div className="flex gap-4">
          <label className="text-sm font-medium text-gray-700 w-32 flex-shrink-0 pt-2">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <textarea
            ref={ref}
            className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              error ? 'border-red-500' : 'border-gray-300'
            } ${className}`}
            rows={4}
            {...props}
          />
        </div>
        {error && <p className="ml-36 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';
