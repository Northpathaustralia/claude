import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext.jsx';
import { Kicker, H2, StateLine, Btn } from '../components/ui.jsx';

export default function Account() {
  const { account, setAccount, vip, restockRequests } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  if (!account) {
    return (
      <main className="mx-auto max-w-md px-4 py-16 sm:py-24">
        <Kicker>Account</Kicker>
        <H2 className="mt-3">Sign in.</H2>
        <StateLine className="my-8" />
        <p className="mb-6 font-mono text-xs text-ink/60">
          Prototype account — connects to Shopify customer accounts in production
          (docs/SHOPIFY_HANDOFF.md). Enter any name/email to preview the interface.
        </p>
        <form
          className="space-y-3" data-testid="account-form"
          onSubmit={(e) => { e.preventDefault(); if (name && email) setAccount({ name, email }); }}
        >
          <input required placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} aria-label="Name"
            className="w-full border-2 border-ink/20 bg-transparent px-4 py-3 text-sm outline-none focus:border-cobalt" />
          <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Email"
            className="w-full border-2 border-ink/20 bg-transparent px-4 py-3 text-sm outline-none focus:border-cobalt" />
          <Btn type="submit" className="w-full" data-testid="account-signin">Enter account</Btn>
        </form>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
      <Kicker>Account</Kicker>
      <H2 className="mt-3">Hey, {account.name.split(' ')[0]}.</H2>
      <StateLine className="my-8" />
      <div className="grid gap-6 sm:grid-cols-2">
        <section className="border border-ink/10 bg-white/40 p-5">
          <p className="font-display text-sm font-extrabold uppercase">Orders</p>
          <p className="mt-2 font-mono text-xs text-ink/60">No orders yet — your first one shows up here the moment it's placed.</p>
          <Link to="/shop" className="mt-3 inline-block font-mono text-xs uppercase tracking-widest2 underline hover:text-cobalt">Shop the range</Link>
        </section>
        <section className="border border-ink/10 bg-white/40 p-5">
          <p className="font-display text-sm font-extrabold uppercase">VIP status</p>
          <p className="mt-2 font-mono text-xs text-ink/60">
            {vip ? `✓ On the list as ${vip.email}. 48h early access on every drop.` : 'Not on the VIP list yet.'}
          </p>
        </section>
        <section className="border border-ink/10 bg-white/40 p-5">
          <p className="font-display text-sm font-extrabold uppercase">Restock alerts</p>
          <p className="mt-2 font-mono text-xs text-ink/60">
            {restockRequests.length > 0 ? `${restockRequests.length} active alert(s).` : 'None set — hit "Notify me" on a sold-out size.'}
          </p>
        </section>
        <section className="border border-ink/10 bg-white/40 p-5">
          <p className="font-display text-sm font-extrabold uppercase">Details</p>
          <p className="mt-2 font-mono text-xs text-ink/60">{account.name} · {account.email}</p>
          <button onClick={() => setAccount(null)} className="mt-3 font-mono text-xs uppercase tracking-widest2 underline hover:text-signal" data-testid="account-signout">
            Sign out
          </button>
        </section>
      </div>
    </main>
  );
}
