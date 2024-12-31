import supabase from './supabase.js';
import './style.css';
import React, { useState, useEffect } from 'react';
// import config from './config.mjs';

// Backend URLs:
const backendBase = 'https://test-app-backend-bib7.onrender.com';
const LOGIN_URL = `${backendBase}/login`;
const LOGOUT_URL = `${backendBase}/logout`;
// const CALLBACK_URL = `${backendBase}/callback`;
const USER_URL = `${backendBase}/user`;

const initialFacts = [
  {
    id: 1,
    text: 'React is being developed by Meta (formerly facebook)',
    source: 'https://opensource.fb.com/',
    category: 'Technology',
    votesInteresting: 24,
    votesMindblowing: 9,
    votesFalse: 4,
    createdIn: 2021,
  },
  {
    id: 2,
    text: 'Millennial dads spend 3 times as much time with their kids than their fathers spent with them. In 1982, 43% of fathers had never changed a diaper. Today, that number is down to 3%',
    source: 'https://www.mother.ly/parenting/millennial-dads-spend-more-time-with-their-kids',
    category: 'society',
    votesInteresting: 11,
    votesMindblowing: 2,
    votesFalse: 0,
    createdIn: 2019,
  },
  {
    id: 3,
    text: 'Lisbon is the capital of Portugal',
    source: 'https://en.wikipedia.org/wiki/Lisbon',
    category: 'Society',
    votesInteresting: 8,
    votesMindblowing: 3,
    votesFalse: 1,
    createdIn: 2015,
  },
];

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <span style={{ fontSize: '40px' }}>{count}</span>
      <button className="btn btn-large" onClick={() => setCount((c) => c + 1)}>
        +1
      </button>
    </div>
  );
}

function App() {
  const [showForm, setShowForm] = useState(false);
  const [facts, setFacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState('all');
  const [userInfo, setUserInfo] = useState(null);

  useEffect(
    function () {
      async function getFacts() {
        setIsLoading(true);

        let query = supabase.from('facts').select('*');

        if (currentCategory !== 'all') query = query.eq('category', currentCategory);

        const { data: facts, error } = await query.order('votesInteresting', { acending: false }).limit(1000);

        if (!error) setFacts(facts);
        else alert('There was a problem getting data');
        setIsLoading(false);

        console.log(error);
        setFacts(facts);
        setIsLoading(false);
      }
      getFacts();
    },
    [currentCategory]
  );

  //---Start of Singpass Demo app javascript---//
  // const [userInfo, setUserInfo] = useState(null);

  // Fetch user info when the component mounts
  useEffect(() => {
    fetch(USER_URL, {
      method: 'GET',
      credentials: 'include', // Send cookies along with the request
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        }
        throw new Error('Not logged in');
      })
      .then((data) => {
        setUserInfo(data); // Set user information if logged in
      })
      .catch(() => {
        setUserInfo(null); // No user info, user is not logged in
      });
  }, []);

  const handleLogin = () => {
    // Redirect or handle login logic
    window.location.href = LOGIN_URL;
  };

  const handleLogout = () => {
    // Redirect or handle logout logic
    window.location.href = LOGOUT_URL;
  };
  //---End of Singpass Demo app javscript---//

  return (
    <>
      <Header showForm={showForm} setShowForm={setShowForm} userInfo={userInfo} />
      {showForm ? <NewFactForm setFacts={setFacts} setShowForm={setShowForm} /> : null}

      <main className="main">
        <CategoryFilter setCurrentCategory={setCurrentCategory} />

        {isLoading ? <Loader /> : <FactList facts={facts} setFacts={setFacts} />}
      </main>
    </>
  );
}

function Loader() {
  return <p className="load-msg">Loading...</p>;
}
// console.log(Loader);

function Header({ showForm, setShowForm, userInfo }) {
  const appTitle = 'Edwin Lau';

  console.log(userInfo);

  // Using a tanery operator to create 'if/else' for message
  // Example: const <variable> = <condition> ? <trueValue> : <falseValue>;
  // const message = userInfo ? `Welcome back, ${userInfo.name}` : 'Not logged in';

  const message =
    userInfo && userInfo.name && userInfo.name.value ? `Welcome back, ${userInfo.name.value}` : 'Not logged in';

  return (
    <header className="header">
      <div className="logo">
        <img src="ed-avatar.png" height="32px" width="32px" alt="Edwin Lau" />
        <h1>{appTitle}</h1>
      </div>

      <div className="btn-header">
        {/* --- Start of Singpass log in button --- */}
        <div className="btn-sp-group">
          {/** Check for userInfo. If userInfo is defined, render logout button. Else, render login button */}

          {userInfo ? (
            <a href={LOGOUT_URL} id="logout" className="singpass-btn">
              Log out
            </a>
          ) : (
            <a href={LOGIN_URL} id="login" className="singpass-btn">
              Log in with <img src="singpass.svg" alt="Singpass" />
            </a>
          )}

          {/* Example: {userInfo ? 'You are not logged in' : 'Your UINFIN'} */}

          <p className="msg" id="msg">
            {message}
          </p>
        </div>
        {/* --- End of Singpass Demo App Button --- */}
        {/* Start of 'Share a fact' button */}
        <button className="btn btn-large btn-open" onClick={() => setShowForm((show) => !show)}>
          {showForm ? 'Close' : 'Share a fact'}
        </button>
        {/* End of 'Share a fact' button */}
      </div>
    </header>
  );
}

const CATEGORIES = [
  { name: 'technology', color: '#3b82f6' },
  { name: 'science', color: '#16a34a' },
  { name: 'finance', color: '#ef4444' },
  { name: 'society', color: '#eab308' },
  { name: 'entertainment', color: '#db2777' },
  { name: 'health', color: '#14b8a6' },
  { name: 'history', color: '#f97316' },
  { name: 'news', color: '#8b5cf6' },
];

function isValidHttpUrl(string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === 'http:' || url.protocol === 'https:';
}

function NewFactForm({ setFacts, setShowForm }) {
  const [text, setText] = useState('');
  const [source, setSource] = useState('');
  const [category, setCategory] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const textLength = text.length;

  async function handleSubmit(e) {
    //1. Prevent browser reload
    e.preventDefault();
    console.log(text, source, category);

    //2. Check if data is valid. If so, create a new fact.
    if (text && isValidHttpUrl(source) && category && textLength <= 200) {
      //3. Create a new fact object
      // const newFact = {
      //   id: Math.round(Math.random() * 1000000),
      //   text,
      //   source,
      //   category,
      //   votesInteresting: 11,
      //   votesMindblowing: 2,
      //   votesFalse: 0,
      //   createdIn: new Date().getFullYear(),
      // };

      //3. Upload fact to Supabase and receive the new object
      setIsUploading(true);
      const { data: newFact, error } = await supabase.from('facts').insert([{ text, source, category }]).select();
      setIsUploading(false);

      // console.log(newFact);

      //4. Add new fact to UI: Add the fact to state
      if (!error) setFacts((facts) => [newFact[0], ...facts]);

      //Reset input fields
      setText('');
      setSource('');
      setCategory('');

      //5. Close form
      setShowForm(false);
    }
  }
  return (
    <form className="fact-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Share a fact with the world..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={isUploading}
      />
      <span>{200 - textLength}</span>
      <input
        value={source}
        type="text"
        placeholder="Trustworthy source..."
        onChange={(e) => setSource(e.target.value)}
        disabled={isUploading}
      />

      <select value={category} onChange={(e) => setCategory(e.target.value)} disabled={isUploading}>
        <option value="">Choose category:</option>
        {CATEGORIES.map((cat) => (
          <option key={cat.name} value={cat.name}>
            {cat.name.toUpperCase()}
          </option>
        ))}
      </select>
      <button className="btn btn-large" disabled={isUploading}>
        Post
      </button>
    </form>
  );
}

function CategoryFilter({ setCurrentCategory }) {
  return (
    <aside className="category-nav">
      <ul className="category-list">
        <li className="category">
          <button className="btn btn-all-categories" onClick={() => setCurrentCategory('all')}>
            All
          </button>
        </li>
        {CATEGORIES.map((cat) => (
          <li key={cat.name} className="category">
            <button
              className="btn btn-category"
              // style={{ backgroundColor: cat.color }}
              onClick={() => setCurrentCategory(cat.name)}
            >
              {cat.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function FactList({ facts, setFacts }) {
  if (facts.length === 0) return <p className="load-msg">No facts for this category. Create one above.</p>;

  return (
    <section>
      <ul className="facts-list">
        {facts.map((fact) => (
          <Fact key={fact.id} fact={fact} setFacts={setFacts} />
        ))}
      </ul>
      <p>There are {facts.length} facts in the database. Add your own!</p>
    </section>
  );
}

function Fact({ fact, setFacts }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const isDisputed = fact.votesInteresting + fact.votesMindblowing < fact.votesFalse;
  async function handleVote(columnName) {
    setIsUpdating(true);
    const { data: updatedFact, error } = await supabase
      .from('facts')
      .update({ [columnName]: fact[columnName] + 1 })
      .eq('id', fact.id)
      .select();
    setIsUpdating(false);

    if (!error) setFacts((facts) => facts.map((f) => (f.id === fact.id ? updatedFact[0] : f)));
  }

  return (
    <li className="fact">
      <p>
        {isDisputed ? <span className="disputed"> ⚠️ Disputed</span> : null}
        {fact.text}
        <a className="source" href={fact.source} target="_blank">
          (Source)
        </a>
      </p>
      <span
        className="tag"
        style={{
          backgroundColor: CATEGORIES.find((cat) => cat.name === fact.category).color,
        }}
      >
        {fact.category}
      </span>
      <div className="vote-buttons">
        <button onClick={() => handleVote('votesMindblowing')} disable={isUpdating}>
          🌟 {fact.votesMindblowing}
        </button>
        <button onClick={() => handleVote('votesInteresting')} disable={isUpdating}>
          ⬆️ {fact.votesInteresting}
        </button>
        <button onClick={() => handleVote('votesFalse')} disable={isUpdating}>
          ⬇️ {fact.votesFalse}
        </button>
      </div>
    </li>
  );
}

export default App;
