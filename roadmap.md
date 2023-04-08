# Для v1
- [x] Поменять isDirty на dirty в ValidationProvider
- [x] Поменять у setError параметры type и message местами и сделать type необязательным


- [x] Добавить флаг pristine у полей/формы
- [x] Добавить событие при изменении полей
- [x] Добавить метод onFieldChange у формы
- [x] Сверять старые и новые значения полей структурно (массивы и объекты не равны друг другу). Добавлен isEqual метод у ValidationField
- [x] Оптимизировать количество пересчётов вычисляемых полей в ValidationProvider
- [ ] Описать в документации об ValidationFieldArray/ValidationErrors

# Для v2
- [x] Выпилить rules, @vue-validate-form/validators используются через `resolver`
- [ ] Поменять формат параметров setError (из вне нужно передавать объект ошибки)
