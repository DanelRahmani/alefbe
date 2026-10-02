"use client";

import { useLayoutEffect, useRef, type RefObject } from "react";
import { useStore } from "@/lib/storage";
import { drillUiStore } from "@/lib/stores";
import { PersianKeyboard } from "../drill/PersianKeyboard";

/**
 * A typed Persian answer with Check / Next and the on-screen keyboard, as the
 * vocabulary deck has it: Enter checks, then moves on; the keyboard types at
 * the caret.
 */
export function FaAnswerField({
  id,
  value,
  onChange,
  onSubmit,
  onNext,
  answered,
  ok,
  inputRef,
  describedBy,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onNext: () => void;
  /** An answer has been checked: the field is read-only and the button says Next. */
  answered: boolean;
  /** Whether the checked answer was right (for aria-invalid). */
  ok?: boolean;
  inputRef: RefObject<HTMLInputElement | null>;
  describedBy: string;
}) {
  const ui = useStore(drillUiStore);
  const caret = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (caret.current !== null && inputRef.current) {
      inputRef.current.setSelectionRange(caret.current, caret.current);
      caret.current = null;
    }
  }, [value, inputRef]);

  const range = () => {
    const el = inputRef.current;
    return [el?.selectionStart ?? value.length, el?.selectionEnd ?? value.length] as const;
  };
  const insert = (text: string) => {
    if (answered) return;
    const [a, b] = range();
    caret.current = a + text.length;
    onChange(value.slice(0, a) + text + value.slice(b));
  };
  const backspace = () => {
    if (answered) return;
    const [a, b] = range();
    const from = a === b ? Math.max(0, a - 1) : a;
    caret.current = from;
    onChange(value.slice(0, from) + value.slice(b));
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (answered) onNext();
          else onSubmit();
        }}
        noValidate
        className="mt-4"
      >
        <label htmlFor={id} className="sr-only">
          Your answer
        </label>
        <div className="flex gap-2">
          <input
            id={id}
            ref={inputRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            readOnly={answered}
            dir="rtl"
            lang="fa"
            inputMode={ui.keyboard ? "none" : "text"}
            className="quiz-input fa"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            aria-invalid={answered ? !ok : undefined}
            aria-describedby={describedBy}
          />
          {!answered ? (
            <button key="check" type="submit" className="ui btn">
              Check
            </button>
          ) : (
            <button key="next" type="button" className="ui btn" onClick={onNext} autoFocus>
              Next
            </button>
          )}
        </div>
      </form>
      <div className="mt-3">
        <button
          type="button"
          className="ui text-sm text-muted underline underline-offset-4"
          onClick={() => drillUiStore.set((u) => ({ ...u, keyboard: !u.keyboard }))}
          aria-expanded={ui.keyboard}
        >
          {ui.keyboard ? "Hide the Persian keyboard" : "Show the Persian keyboard"}
        </button>
        {ui.keyboard && <PersianKeyboard onInsert={insert} onBackspace={backspace} />}
      </div>
    </>
  );
}
