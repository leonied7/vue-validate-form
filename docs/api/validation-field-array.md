# Validation Field Array

## Параметры слота по-умолчанию с ограниченной областью видимости

| Имя      |                                            Тип                                            | Описание                                  |
|----------|:-----------------------------------------------------------------------------------------:|-------------------------------------------|
| name     |                                         `string`                                          | Имя поля                                  |
| fields   |                                      `ArrayField[]`                                       | Значение поля                             |
| onChange |                              `(value: ArrayField[]) => void`                              | Метод обновления текущий значений         |
| append   |                   `(value: ArrayField, options?: FocusOptions) => void`                   | Метод добавления элемента в конец         |
| prepend  |                   `(value: ArrayField, options?: FocusOptions) => void`                   | Метод добавления элемента в начало        |
| insert   |           `(index: number, value: ArrayField, options?: FocusOptions) => void`            | Метод добавления элемента в `index`       |
| swap     |               `(from: number, to: number, options?: FocusOptions) => void`                | Метод смены мест элементов между собой    |
| move     |               `(from: number, to: number, options?: FocusOptions) => void`                | Метод перемещения элемента на новое место |
| remove   |                     `(index: number, options?: FocusOptions) => void`                     | Метод удаления элемента                   |

<sup>*</sup> [ArrayField](./types.md#arrayfield)

<sup>*</sup> [FocusOptions](./types.md#focusoptions)

## Входные параметры

| Имя      | Тип      | Значение по-умолчанию | Описание                                                     |
|----------|----------|-----------------------|--------------------------------------------------------------|
| name     | `string` |                       | Имя поля                                                     |
| keyName  | `string` | `id`                  | Поле, которое содержит уникальное значение элементов массива |
