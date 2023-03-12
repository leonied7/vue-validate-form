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

#### Rule
```ts
type Rule = {
  value: any;
  message: string;
}
```

#### Rules
```ts
type Rule = Record<string, Rule>
```
