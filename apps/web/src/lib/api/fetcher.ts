export default function fetcher() {
  return (url: string) => fetch(url).then((res) => res.json());
}
