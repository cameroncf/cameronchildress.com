<script setup>
import { useData } from 'vitepress'
import DefaultTheme from "vitepress/theme";
const { Layout } = DefaultTheme;
const { page } = useData();

const foo = (raw) => {
  const date = new Date(raw);
  date.setUTCHours(12);
  return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
}
</script>

<template>
  <Layout>
    <template #doc-before>
      <div>Posted By: {{ page.frontmatter.author }} / {{ foo(page.frontmatter.date) }} <br/><br/></div>
    </template>
  </Layout>
</template>
