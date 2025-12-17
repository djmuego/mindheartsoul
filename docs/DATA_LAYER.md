
# Data Layer & Validation

## Storage Driver
The application uses a driver-based storage system to allow for future backend integration without refactoring the entire codebase.

### StorageDriver Interface
```typescript
export interface StorageDriver {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}
```

### implementations
- **LocalStorageDriver**: The default for the web app. Persists to browser `localStorage`.
- **MemoryDriver**: Used for tests. In-memory object.
- **HttpDriverStub**: A template for future API integration.

### Switching Drivers
To switch drivers (e.g., in a test setup or entry point):
```typescript
import { setStorageDriver } from './services/storage';
import { MemoryDriver } from './services/storageDriver/memoryDriver';

setStorageDriver(new MemoryDriver());
```

## Validation (Zod)
To prevent "corrupt localStorage crashing the app", all critical data reads use Zod validation via `storage.getValidatedJSON`.

### Schemas
Located in `src/schemas/`.
- `session.schema.ts`: User & Session
- `booking.schema.ts`: Bookings
- `community.schema.ts`: Posts & Comments
- `courses.schema.ts`: Courses & Progress

### Strategy
1. **Read**: `storage.getValidatedJSON(key, schema, fallback)`
2. **Validate**: If `schema.safeParse` fails, the error is logged to console (warn), and `fallback` is returned.
3. **Recovery**: The app continues to function using the fallback (e.g., empty array), effectively "resetting" that feature's local state if it was corrupted.

## Maintenance Tools
Admins can access the Maintenance menu in Settings:
- **Export**: Downloads a JSON dump of all `mhs_*` keys.
- **Import**: Restores `mhs_*` keys from a JSON file.
- **Reset**: Clears all data except Language and Theme preferences.
