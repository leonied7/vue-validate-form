# Validation Field

## Параметры слота по-умолчанию с ограниченной областью видимости

| Имя        |               Тип                | Описание                                                  |
|------------|:--------------------------------:|-----------------------------------------------------------|
| name       |             `string`             | Имя поля                                                  |
| modelValue |              `any`               | Значение поля                                             |
| errors     |       `Errors`<sup>*</sup>       | Ошибки поля                                               |
| firstError | `Error \| undefined`<sup>*</sup> | Первая ошибка                                             |
| dirty      |            `boolean`             | Если текущее значение отличается от значения по-умолчанию |
| pristine   |            `boolean`             | Нетронутое поле (небыло взаимодействие с полем)           |
| invalid    |            `boolean`             | Если присутствуют ошибки валидации                        |
| onChange   |      `(value: any) => void`      | Метод, который устанавливает значение для поля            |
| setError   |     `(error: Error) => void`     | Метод, который устанавливает ошибку для поля              |

<sup>*</sup> [Errors](./types.md#errors)

<sup>*</sup> [Error](./types.md#error)

## Входные параметры

| Имя      | Тип                           | Значение по-умолчанию | Описание                                             |
|----------|-------------------------------|-----------------------|------------------------------------------------------|
| name     | `string`                      |                       | Имя поля                                             |
| isEqual  | `(a: any, b: any) => boolean` | `(a, b) => a === b`   | Метод, используемый для сравнения равенства значений |

## События

| Имя           |         Тип          | Описание                                         |
|---------------|:--------------------:|--------------------------------------------------|
| should-focus  | `({ name: string })` | Отправляется когда необходимо сфокусировать поле |
| change        |    `(value: any)`    | Отправляется при каждом изменении значения поля  |