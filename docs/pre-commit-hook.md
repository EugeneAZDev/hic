# Pre-commit Hook

This project includes a pre-commit hook that automatically runs lint and build checks before allowing commits. This prevents commits with linting errors or build failures.

## How it works

The pre-commit hook is located at `.git/hooks/pre-commit` and runs automatically when you attempt to commit changes using `git commit`.

### Checks performed

1. **Lockfile synchronization**: Checks if `pnpm-lock.yaml` is up to date with `package.json` files
2. **Lint checks**: Runs `pnpm run lint` to check for ESLint and Prettier errors
3. **Build checks**: Runs `pnpm run build` to ensure the project builds successfully

### What happens when checks fail

If any check fails, the commit is blocked and you'll see an error message like:

**Lockfile out of sync:**
```
✗ pnpm-lock.yaml is out of sync with package.json files!
This will cause GitHub Actions to fail with ERR_PNPM_OUTDATED_LOCKFILE error.
```

**Lint errors:**
```
✗ Lint checks failed! Please fix the linting errors before committing.
You can run 'pnpm run lint' to see the specific errors.
```

**Build errors:**
```
✗ Build checks failed! Please fix the build errors before committing.
You can run 'pnpm run build' to see the specific errors.
```

## Fixing issues

### Lockfile out of sync

If you see the lockfile synchronization error, run:

```bash
pnpm install
git add pnpm-lock.yaml
git commit -m "chore: update pnpm-lock.yaml"
```

This will update the lockfile to match your package.json files and prevent GitHub Actions failures.

### Lint errors

To fix linting errors, run:

```bash
pnpm run lint
```

This will show you the specific errors. Most formatting issues can be auto-fixed by running:

```bash
pnpm run format
```

### Build errors

To fix build errors, run:

```bash
pnpm run build
```

This will show you the specific build errors that need to be resolved.

## Bypassing the hook (not recommended)

If you absolutely need to bypass the pre-commit hook (not recommended), you can use:

```bash
git commit --no-verify -m "your commit message"
```

However, this should only be used in exceptional circumstances as it defeats the purpose of having quality checks.

## Configuration

The pre-commit hook script is located at `.git/hooks/pre-commit` and can be modified if needed. The script:

- Uses colored output for better readability
- Checks for required tools (pnpm, turbo)
- Runs lint and build checks in sequence
- Provides clear error messages when checks fail

## ESLint Configuration

Each service has its own ESLint configuration:

- **Backend services** (auth-service, backend, worker-service): Use `.eslintrc.js` with TypeScript support
- **Frontend**: Uses `.eslintrc.js` with Next.js configuration
- **Shared packages**: Use the same TypeScript configuration

## Troubleshooting

### Hook not running

Make sure the hook is executable:

```bash
chmod +x .git/hooks/pre-commit
```

### Permission issues

If you encounter permission issues, make sure you have the necessary permissions to run the hook and that pnpm is properly installed.

### Dependencies missing

If you see errors about missing dependencies, run:

```bash
pnpm install
```

This will install all required dependencies for linting and building.
