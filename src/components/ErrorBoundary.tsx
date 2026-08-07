import React, { ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RefreshCw, Sparkles } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  props: Props;
  state: State = {
    hasError: false,
    error: null,
  };

  constructor(props: Props) {
    super(props);
    this.props = props;
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught Error in DreamWeaver Application:', error, errorInfo);
  }

  private handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#070514] text-indigo-50 flex items-center justify-center p-6 text-center font-sans">
          <div className="bg-[#0e0b29] border border-amber-400/40 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mx-auto text-amber-300">
              <ShieldAlert className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h2 className="font-serif text-2xl font-bold text-amber-200">
                DreamWeaver Encountered a Snag
              </h2>
              <p className="text-xs text-indigo-200/80 leading-relaxed">
                We caught a temporary display issue. Don't worry, your bedtime stories and child profiles are safe!
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 rounded-xl bg-slate-950 border border-white/10 text-[11px] text-amber-300/80 font-mono text-left max-h-32 overflow-y-auto">
                {this.state.error.message || 'Unknown runtime error'}
              </div>
            )}

            <div className="pt-2 space-y-2">
              <button
                onClick={() => window.location.reload()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-xs hover:from-amber-300 hover:to-amber-400 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Application</span>
              </button>

              <button
                onClick={this.handleReset}
                className="w-full py-2.5 rounded-xl border border-white/10 bg-white/5 text-indigo-200 font-semibold text-xs hover:bg-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Reset Local Cache & Launch Fresh</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
