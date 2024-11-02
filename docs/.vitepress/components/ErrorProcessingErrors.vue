<template>
  <validation-errors name="firstName">
    <template #default="{ errors, submitted }">
      <div>
        <div>{{submitted}}</div>
        <div>{{errors}}</div>
      </div>
    </template>
  </validation-errors>
</template>
