import sys

with open('apps/web/src/app/games/[slug]/page.js', 'r', encoding='utf-8') as f:
    content = f.read()

target = """  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8" style={{ height: "calc(100vh - 80px)", marginTop: "80px" }}>
      <div className="flex items-center justify-between mb-4">
        <Link href="/games" className="inline-flex items-center text-text-muted hover:text-primary-600 font-medium transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="hidden sm:inline">Back to Games</span>
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">{title}</h1>
          <InGameAdminConfig
            defaultSlug={slug}
            onQuestionsReload={() => setKey((k) => k + 1)}
          />
        </div>
      </div>
      <div className="w-full h-[calc(100%-60px)] rounded-3xl overflow-hidden shadow-2xl border border-gray-100 relative group">"""

if target not in content:
    # Try alternate target
    target = """  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8" style={{ height: "calc(100vh - 80px)", marginTop: "80px" }}>
      <div className="flex items-center justify-between mb-4">
        <Link href="/games" className="inline-flex items-center text-text-muted hover:text-primary-600 font-medium transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Games
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <InGameAdminConfig
            defaultSlug={slug}
            onQuestionsReload={() => setKey((k) => k + 1)}
          />
        </div>
      </div>
      <div className="w-full h-[calc(100%-60px)] rounded-3xl overflow-hidden shadow-2xl border border-gray-100 relative group">"""

replacement = """  return (
    <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 flex flex-col" style={{ height: "calc(100dvh - 80px)", marginTop: "80px" }}>
      <div className="flex items-center justify-between px-3 sm:px-0 py-2 sm:mb-4 shrink-0 bg-white sm:bg-transparent z-10">
        <Link href="/games" className="inline-flex items-center text-text-muted hover:text-primary-600 font-medium transition-colors text-sm sm:text-base">
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Back</span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <h1 className="text-lg sm:text-2xl font-bold text-foreground truncate max-w-[150px] sm:max-w-none">{title}</h1>
          <InGameAdminConfig
            defaultSlug={slug}
            onQuestionsReload={() => setKey((k) => k + 1)}
          />
        </div>
      </div>
      <div className="w-full flex-1 sm:rounded-3xl overflow-hidden sm:shadow-2xl sm:border border-gray-100 relative group">"""

if target in content:
    new_content = content.replace(target, replacement)
    with open('apps/web/src/app/games/[slug]/page.js', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Replaced successfully")
else:
    print("Target not found")
