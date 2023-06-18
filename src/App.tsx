import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import classNames from 'classnames';
import { peopleFromServer } from './data/people';
import { DropMenu } from './Components/DropMenu';
import { Person } from './types/Person';

const debounce = (f: (...args: string[]) => void, delay: number) => {
  let timerId: number;

  return (...args: string[]) => {
    clearTimeout(timerId);
    timerId = window.setTimeout(f, delay, ...args);
  };
};

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selected, setSelected] = useState<Person | null>(null);
  const [suggestionsList, setSuggestionsList] = useState(false);

  const applyQuery = useCallback(
    debounce(setSuggestionsList(true), setAppliedQuery, 1000),
    [],
  );

  const selectPerson = useCallback((person: Person) => {
    setSelected(person);
    setQuery('');
    setAppliedQuery('');
  }, [setSelected, setQuery, setAppliedQuery]);

  const visiblePeople = useMemo(() => {
    return peopleFromServer.filter(
      person => person.name
        .toLowerCase().includes(appliedQuery.toLowerCase().trim()),
    );
  }, [peopleFromServer, appliedQuery]);

  return (
    <main className="section">
      <h1 className="title">
        {selected ? (
          `${selected.name} (${selected.born} = ${selected.died})`
        ) : (
          'No selected person'
        )}
      </h1>

      <div className={classNames(
        'dropdown',
        { 'is-active': !appliedQuery && !suggestionsList },
      )}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={event => {
              setQuery(event.target.value);
              applyQuery(event.target.value);
            }}
          />
        </div>

        {appliedQuery && (
          <DropMenu
            people={visiblePeople}
            onSelect={selectPerson}
          />
        )}
      </div>
    </main>
  );
};