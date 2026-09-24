import sys

with open('apps/web/src/app/games/page.js', 'r', encoding='utf-8') as f:
    content = f.read()

target = """                            {category}
                                    <Link"""

replacement = """                            {category}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                {filteredGames.map((game) => {
                    const Icon = game.icon;
                    return (
                        <div
                            key={game.id}
                            className={`
                relative rounded-3xl p-5 border border-white/20
                group overflow-hidden transition-all duration-300
                ${game.cardBg}
                ${game.disabled 
                  ? 'opacity-60 grayscale' 
                  : 'shadow-[0_10px_20px_rgba(0,0,0,0.3),_inset_0_-4px_0_rgba(0,0,0,0.2)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.4),_inset_0_-1px_0_rgba(0,0,0,0.1)] hover:-translate-y-2 hover:scale-[1.02] cursor-pointer'}
              `}
                        >
                            {/* Subtle overlay glow */}
                            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />

                            {game.disabled && (
                                <div className="absolute top-4 right-4 text-[9px] uppercase tracking-wider font-extrabold px-2 py-1 rounded-full bg-black/20 text-white backdrop-blur-md">
                                    Coming Soon
                                </div>
                            )}

                            <div className={`relative z-10 w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-white/20 backdrop-blur-sm shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}>
                                <Icon className={`w-6 h-6 text-white drop-shadow-sm`} />
                            </div>

                            <h3 className={`relative z-10 text-xl font-extrabold mb-1.5 ${game.textColor}`}>{game.name}</h3>
                            <p className={`relative z-10 text-xs mb-6 font-medium leading-snug opacity-90 line-clamp-3 ${game.textColor}`}>{game.description}</p>

                            <div className="relative z-10 flex items-center justify-between mt-auto">
                                <span className={`text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm ${game.pillBg} ${game.pillText}`}>
                                    {game.category}
                                </span>

                                {!game.disabled ? (
                                    <Link"""

if target in content:
    new_content = content.replace(target, replacement)
    with open('apps/web/src/app/games/page.js', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Replaced successfully")
else:
    print("Target not found")
