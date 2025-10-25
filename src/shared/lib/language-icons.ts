export const languageIconMap: Record<string, string> = {
  JavaScript:
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",
  TypeScript:
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
  Python:
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg",
  Java: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg",
  "C#": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg",
  "C++":
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg",
  C: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/c/c-original.svg",
  PHP: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg",
  Ruby: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/ruby/ruby-original.svg",
  Go: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original-wordmark.svg",
  Rust: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rust/rust-original.svg",
  Swift:
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/swift/swift-original.svg",
  Kotlin:
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kotlin/kotlin-original.svg",
  Dart: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/dart/dart-original.svg",
  Scala:
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/scala/scala-original.svg",
  Elixir:
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/elixir/elixir-original.svg",
  Haskell:
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/haskell/haskell-original.svg",
  Perl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/perl/perl-original.svg",
  Lua: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/lua/lua-original.svg",
  R: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/r/r-original.svg",
  Matlab:
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/matlab/matlab-original.svg",
  Zig: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/zig/zig-original.svg",

  HTML: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg",
  CSS: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg",
  Svelte:
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/svelte/svelte-original.svg",

  Shell:
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bash/bash-original.svg",
  Dockerfile:
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-plain.svg",
  EJS: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg",

  "Objective-C":
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/objectivec/objectivec-plain.svg",
  "Objective-C++":
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/objectivec/objectivec-plain.svg",

  Racket:
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/ruby/ruby-original.svg",
  PowerShell:
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/powershell/powershell-original.svg",
  Makefile:
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bash/bash-original.svg",

  CMake:
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cmake/cmake-original.svg",
  Nix: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nixos/nixos-original.svg",
  MDX: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/markdown/markdown-original.svg",
};

/**
 * Get icon URL for a language name
 */
export function getLanguageIcon(languageName: string): string | null {
  return languageIconMap[languageName] || null;
}

/**
 * Convert repository languages object to tech stack format
 */
export function languagesToTechStacks(languages: Record<string, number>) {
  if (!languages || typeof languages !== "object") return [];

  return Object.keys(languages)
    .slice(0, 10)
    .map((langName) => ({
      id: langName,
      name: langName,
      iconUrl: getLanguageIcon(langName),
    }));
}
