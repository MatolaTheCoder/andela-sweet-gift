import React from 'react';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { HiOutlineFilter, HiOutlineX } from 'react-icons/hi';

/**
 * Botão "Filtros" com um painel de opções e os filtros ativos em etiquetas
 * removíveis.
 *
 * @param {{key: string, label: string, value: string, options: {value: string, label: string, count?: number}[]}[]} groups
 *   Cada grupo é uma escolha única; a primeira opção é o valor neutro ("todos").
 * @param {(key: string, value: string) => void} onChange
 */
export default function FilterMenu({ groups, onChange }) {
  const neutral = (group) => group.options[0].value;
  const active = groups.filter((group) => group.value !== neutral(group));
  const labelOf = (group) => group.options.find((option) => option.value === group.value)?.label;
  const clear = () => groups.forEach((group) => onChange(group.key, neutral(group)));

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Popover className="relative">
        <PopoverButton className="btn btn-secondary">
          <HiOutlineFilter aria-hidden="true" /> Filtros
          {active.length > 0 && (
            <span className="rounded-full bg-purple-800 px-1.5 text-xs font-semibold text-white">
              {active.length}
              <span className="sr-only"> filtro(s) ativo(s)</span>
            </span>
          )}
        </PopoverButton>

        <PopoverPanel className="absolute left-0 top-full z-30 mt-2 w-72 max-w-[85vw] rounded-xl border border-neutral-200 bg-surface p-4 shadow-lg">
          <div className="space-y-4">
            {groups.map((group) => (
              <fieldset key={group.key}>
                <legend className="mb-1.5 text-sm font-semibold text-neutral-900">{group.label}</legend>
                <div className="space-y-1">
                  {group.options.map((option) => (
                    <label
                      key={option.value}
                      className="flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1 text-sm text-neutral-800 hover:bg-neutral-50"
                    >
                      <input
                        type="radio"
                        name={`filtro-${group.key}`}
                        value={option.value}
                        checked={group.value === option.value}
                        onChange={() => onChange(group.key, option.value)}
                        className="h-4 w-4 accent-purple-700"
                      />
                      <span className="flex-1">{option.label}</span>
                      {option.count !== undefined && <span className="text-neutral-600">{option.count}</span>}
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>
          <div className="mt-4 flex justify-end border-t border-neutral-200 pt-3">
            <button type="button" className="link-action" onClick={clear} disabled={active.length === 0}>
              Limpar filtros
            </button>
          </div>
        </PopoverPanel>
      </Popover>

      {active.map((group) => (
        <span
          key={group.key}
          className="inline-flex items-center gap-1 rounded-full bg-purple-50 py-1 pl-3 pr-1.5 text-sm font-medium text-purple-800 ring-1 ring-inset ring-purple-200"
        >
          {group.label}: {labelOf(group)}
          <button
            type="button"
            onClick={() => onChange(group.key, neutral(group))}
            className="rounded-full p-0.5 hover:bg-purple-100"
            aria-label={`Remover filtro ${group.label}: ${labelOf(group)}`}
          >
            <HiOutlineX aria-hidden="true" />
          </button>
        </span>
      ))}
    </div>
  );
}
