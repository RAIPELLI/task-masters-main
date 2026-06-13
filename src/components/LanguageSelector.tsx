import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Globe } from 'lucide-react';

export function LanguageSelector() {
    const { i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full hover:bg-slate-100 transition-colors">
                    <Globe className="w-5 h-5 text-slate-500" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32 rounded-xl">
                <DropdownMenuItem
                    className="cursor-pointer font-medium p-3 hover:bg-slate-50 rounded-lg transition-colors"
                    onClick={() => changeLanguage('en')}
                >
                    English
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="cursor-pointer font-medium p-3 hover:bg-slate-50 rounded-lg transition-colors"
                    onClick={() => changeLanguage('te')}
                >
                    తెలుగు
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="cursor-pointer font-medium p-3 hover:bg-slate-50 rounded-lg transition-colors"
                    onClick={() => changeLanguage('hi')}
                >
                    हिन्दी
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
