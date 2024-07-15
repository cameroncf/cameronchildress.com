<script setup>
import { useData } from 'vitepress'
import DefaultTheme from "vitepress/theme";
const { Layout } = DefaultTheme;
const { page } = useData();

const formatDate = (raw) => {
  // no date supplied
  if (!raw) return "";
  // date found, format it
  const date = new Date(raw);
  date.setUTCHours(12);
  return " / " + date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
}
</script>

<template>
  <Layout>
    <template #doc-before v-if="page.frontmatter.author">
      <div>Posted By: {{ page.frontmatter.author }}{{ formatDate(page.frontmatter.date) }} <br/><br/></div>
    </template>
  </Layout>
</template>
