import { Component } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, errorMessage: '' };
    }

    static getDerivedStateFromError(error) {
        return {
            hasError: true,
            errorMessage: error?.message || 'An unexpected interface error occurred.',
        };
    }

    handleReset = () => {
        this.setState({ hasError: false, errorMessage: '' });
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-[#17191C] text-[#F2F0EA] flex items-center justify-center p-6">
                    <div className="max-w-md w-full border border-white/15 bg-white/[0.03] p-8 space-y-5">
                        <div className="flex items-center gap-2.5 text-[#657568]">
                            <AlertTriangle className="w-5 h-5" />
                            <span className="font-mono text-xs uppercase tracking-widest">Application Notice</span>
                        </div>
                        <h1 className="font-display text-2xl font-extrabold tracking-tight">
                            Something went wrong while rendering this view.
                        </h1>
                        <p className="text-sm text-[#F2F0EA]/70 leading-relaxed">
                            {this.state.errorMessage}
                        </p>
                        <button
                            type="button"
                            onClick={this.handleReset}
                            className="inline-flex items-center gap-2 bg-[#F2F0EA] text-[#17191C] px-5 py-2.5 text-xs font-mono font-semibold uppercase tracking-widest hover:bg-[#657568] hover:text-white transition-colors"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Return to Home</span>
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}