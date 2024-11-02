<template>
  <validation-field name="firstName">
    <template #default="{ modelValue, onChange, errors, invalid, pristine, setError }">
      <div>
        <input :value="modelValue" type="text" @input="onChange($event.target.value)" />
        <template v-if="invalid">
          <span v-for="(error, index) in errors" :key="index">
            {{error.message}}
          </span>
        </template>
        <button type="button" @click="setError({ message: 'custom error message' })">set custom error</button>
      </div>
    </template>
  </validation-field>
</template>
