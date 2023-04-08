# Типы данных

#### Error
```ts
type Error = {
  message: string;
  type?: string;
}
```

#### Errors
```ts
type Errors = Error[];
```

#### ErrorsMap
```ts
type ErrorsMap = Record<string, Errors>;
```
