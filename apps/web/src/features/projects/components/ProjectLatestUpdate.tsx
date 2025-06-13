export default function ProjectLatestUpdate() {
  return (
    <>
      <h2 className="text-md mb-[-10px] font-medium text-black">
        Dernière mise à jour
      </h2>
      <div
        className="h-[226px] w-[668px] overflow-hidden rounded-lg border border-[black]/5 p-6"
        style={{ backgroundColor: "rgba(250, 250, 250, 0.5)" }}
      >
        {/* Commit Info */}
        <div className="space-y-4">
          {/* Commit Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-sm font-medium text-black">Commit 26e7076</h3>
              <span className="text-xs text-black/20">
                par Killian, il y a 8 heures
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-red-500">-0</span>
              <span className="text-xs text-green-500">+272</span>
              <span className="rounded-full bg-black/5 px-2 py-[1.5px] text-xs text-black/50">
                main
              </span>
            </div>
          </div>
          {/* Ligne de séparation */}
          <div className="mb-3 w-full border-t border-dashed border-black/8"></div>

          {/* Commit Description */}
          <div className="space-y-4 text-xs leading-7 text-black/70">
            <p>
              Added documentation for the Requesty AI SDK provider to help
              developers integrate with Requesty's unified LLM gateway. Created
              comprehensive documentation for the Requesty provider
              (content/providers/03-community-providers/5-requesty.mdx)
              including setup instructions, API key configuration, usage
              examples, and advanced features. Also added Requesty to the main
              providers list in the foundations documentation.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
