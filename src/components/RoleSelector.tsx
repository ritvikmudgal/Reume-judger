'use client';

import React from 'react';
import { motion } from 'framer-motion';

const roles = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'AI/ML Engineer',
  'Data Analyst',
  'UI/UX Designer'
];

interface RoleSelectorProps {
  selectedRole: string;
  onRoleChange: (role: string) => void;
}

const RoleSelector = ({ selectedRole, onRoleChange }: RoleSelectorProps) => {
  return (
    <div className="flex flex-wrap gap-2 mb-8 justify-center lg:justify-start">
      {roles.map((role) => (
        <motion.button
          key={role}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onRoleChange(role)}
          className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
            selectedRole === role
              ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-cyan-500/20'
              : 'bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10'
          }`}
        >
          {role}
        </motion.button>
      ))}
    </div>
  );
};

export default RoleSelector;
