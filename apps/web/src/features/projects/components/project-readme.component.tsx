export default function ProjectReadme() {
  return (
    <div
      className="h-[347.72px] w-[668px] overflow-hidden rounded-lg border border-[black]/5 p-6"
      style={{ backgroundColor: "rgba(250, 250, 250, 0.5)" }}
    >
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-sm font-medium text-black">README.md</h2>
        <button className="cursor-pointer text-xs text-black/50">
          View full version
        </button>
      </div>

      {/* Ligne de séparation */}
      <div className="mb-5 w-full border-t border-dashed border-black/8"></div>

      {/* Content */}
      <div className="space-y-4 text-xs">
        <h3 className="text-xs font-medium text-black">
          Bitcoin Core integration/staging tree
        </h3>

        <a
          href="https://bitcoincore.org"
          className="block text-black/70 underline hover:text-black"
        >
          https://bitcoincore.org
        </a>

        <p className="text-black/70">
          For an immediately usable, binary version of the Bitcoin Core
          software, see{" "}
          <a
            href="https://bitcoincore.org/en/download/"
            className="text-black/70 underline hover:text-black"
          >
            https://bitcoincore.org/en/download/
          </a>
          .
        </p>

        <h4 className="mt-6 font-semibold text-black">What is Bitcoin Core?</h4>

        <p className="text-black/70">
          Bitcoin Core connects to the Bitcoin peer-to-peer network to download
          and fully validate blocks and transactions. It also includes a wallet
          and graphical user interface, which can be optionally built.
        </p>

        <p className="text-black/70">
          Further information about Bitcoin Core is available in the{" "}
          <span className="text-black/70 underline">doc folder</span>.
        </p>
      </div>
    </div>
  );
}
