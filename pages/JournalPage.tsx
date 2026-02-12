import { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

const JournalPage = () => {
    useEffect(() => { window.scrollTo(0, 0); }, []);
    return (
        <div className="pt-40 pb-32 px-8 md:px-12 bg-white min-h-screen">
            <div className="max-w-360 mx-auto">
                <h1 className="text-8xl font-serif italic mb-32 text-center">The Journal.</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-32">
                    {[
                        { title: "The Blue Gold: A History of Indigo", img: "/two.jpeg" },
                        { title: "Atelier Sessions: Agba Dam Area", img: "/four.jpeg" }
                    ].map((art, i) => (
                        <div key={i} className="group cursor-pointer">
                            <div className="aspect-video rounded-[3rem] overflow-hidden mb-8 shadow-xl bg-gray-50 flex items-center justify-center text-gray-300">
                                <span className="text-xs uppercase tracking-widest">Article Image</span>
                            </div>
                            <h3 className="text-3xl font-serif hover:italic transition-all">{art.title}</h3>
                            <div className="mt-4 flex items-center gap-4 text-atmos-accent/60">
                                <span className="text-[10px] font-bold uppercase tracking-widest">Read Article</span>
                                <ArrowRight size={14} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default JournalPage;
