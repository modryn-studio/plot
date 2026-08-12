# Agents — deliberately empty

The characters live in **`modryn-hq` on `v4`**, at `.claude/agents/`. That is the only copy that is
maintained; every other copy is a snapshot.

Nothing is seeded here on purpose. A boilerplate copy goes stale the moment a character is edited in
the studio, and it goes stale *invisibly* — nobody opens the boilerplate's agents folder while fixing
a prompt. One stale copy in one project is a small problem. A stale copy in the starter propagates
into every project created after it, which is how a default nobody chose becomes the default
everybody has.

## Fill this on day one

Copy the folders this product actually has work for. `craft/` applies to any product; the rest do
not.

```bash
cp -r ../modryn-hq/.claude/agents/craft   .claude/agents/
cp -r ../modryn-hq/.claude/agents/trading .claude/agents/   # only if it is a trading product
```

Domains available: `craft` · `trading` · `music` · `exterior` · `labs` · `interface` · `media`.
See `modryn-hq/.claude/agents/README.md` for who is in each.

**Copy only what the product is about.** An agent with no domain to work on is a seat nobody sits in,
and it makes the roster harder to read for the ones that matter.

**A `name` must stay unique across this whole folder, subfolders included.** Two files with the same
name do not error: Claude Code loads one of them, chosen by filesystem read order, and never says
which.
