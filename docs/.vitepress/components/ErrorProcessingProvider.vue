<template>
  <validation-provider>
    <template #default="{ errors, invalid, setError }">
      <div>
        <div>{{invalid}}</div>
        <div>{{errors}}</div>
        <button type="button" @click="setError('fieldName', { message: 'custom error message' })">set custom error</button>
      </div>
    </template>
  </validation-provider>
</template>
